import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Document, Harvest, Import, Organization, User } from '@prisma/client';
import { PrismaService } from '../../../shared/services/prisma.service';
import { PERMISSIONS } from './action.enum';
import { RoleTypeNew } from '../../../constants';

export type AppSubjects = Subjects<{
  User: User;
  Organization: Organization;
  Harvest: Harvest;
  Import: Import;
  Document: Document;
}>;

type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class AuthAbilityFactory {
  constructor(private prisma: PrismaService) {}

  forUser = async (user: User) => {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility
    );

    const grant = await this.prisma.grant.findFirst({
      where: { userId: user.id, organizationId: user.organizationId },
      include: {
        role: true,
        organization: true,
      },
    });

    // Permission for all of Users
    // console.log(grant);
    // Action on User Table
    can([PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.DELETE], 'User', {
      id: user.id,
    });

    if (grant && grant.role?.id && grant?.organization?.id) {
      can(
        [
          PERMISSIONS.CREATE,
          PERMISSIONS.READ,
          PERMISSIONS.UPDATE,
          PERMISSIONS.DELETE,
        ],
        ['Harvest', 'Import'],
        {
          organizationId: grant.organization.id,
        }
      );

      switch (grant.role.name) {
        case RoleTypeNew.ADMINISTRATOR:
          can(
            [
              PERMISSIONS.CREATE,
              PERMISSIONS.READ,
              PERMISSIONS.UPDATE,
              PERMISSIONS.DELETE,
            ],
            ['Harvest', 'Document', 'Import'],
            {
              organizationId: grant.organization.id,
            }
          );
          can(
            [
              PERMISSIONS.CREATE,
              PERMISSIONS.READ,
              PERMISSIONS.UPDATE,
              PERMISSIONS.DELETE,
            ],
            ['Organization']
          );
          break;
        case RoleTypeNew.MANAGER:
          cannot([PERMISSIONS.DELETE], ['Import']);
          can(
            [
              PERMISSIONS.CREATE,
              PERMISSIONS.READ,
              PERMISSIONS.UPDATE,
              PERMISSIONS.DELETE,
            ],
            'Organization',
            {
              creatorId: user.id,
            }
          );
          break;
        case RoleTypeNew.NORMAL:
          cannot([PERMISSIONS.UPDATE, PERMISSIONS.DELETE], ['Import']);
          cannot([PERMISSIONS.DELETE], ['Harvest']);
          can(
            [
              PERMISSIONS.CREATE,
              PERMISSIONS.READ,
              PERMISSIONS.UPDATE,
              PERMISSIONS.DELETE,
            ],
            'Organization',
            {
              creatorId: user.id,
            }
          );
          break;
        case RoleTypeNew.REPORTER:
          cannot(
            [PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE],
            ['Import', 'Harvest', 'Organization']
          );
          can([PERMISSIONS.READ], 'Organization', {
            creatorId: user.id,
          });
          break;
        case RoleTypeNew.GUEST:
          cannot(
            [
              PERMISSIONS.READ,
              PERMISSIONS.CREATE,
              PERMISSIONS.UPDATE,
              PERMISSIONS.DELETE,
            ],
            ['Import', 'Harvest', 'Document', 'Organization']
          );
          break;
      }
      //
      //
      // const group = await this.prisma.group.findUnique({
      //   where: { id: groupId },
      //   include: { members: { where: { userId: user.id } } },
      // });
      //
      // if (group === null) {
      //   throw new NotFoundException('A csoport nem található!');
      // }
      //
      // if (group?.ownerId === user.id) {
      //   can(Permissions.Update, 'Group');
      //   can(Permissions.Delete, 'Group');
      //   can(Permissions.PromoteMember, 'Group');
      // }
      //
      // if (
      //   group?.members.length > 0 &&
      //   [GroupRoles.OWNER, GroupRoles.ADMIN].includes(group?.members[0].role)
      // ) {
      //   can(Permissions.AddMember, 'Group');
      //   can(Permissions.ApproveMember, 'Group');
      // }
    }

    return build();
  };
}
