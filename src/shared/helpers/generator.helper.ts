import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import SnowFlake from 'snowflake-id';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GeneratorHelper {
  private snowflakeId: SnowFlake = ((_machineId = 1) => {
    return new SnowFlake({
      mid: _machineId,
      offset: (2021 - 1970) * 31536000 * 1000,
    });
  })();

  public generateSnowflakeId(): bigint {
    return BigInt(this.snowflakeId.generate());
  }

  public uuid(): string {
    return uuid();
  }

  public generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public validateHash(
    password: string | undefined,
    hash: string | undefined
  ): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }

    return bcrypt.compare(password, hash);
  }

  public getVariableName<TResult>(getVar: () => TResult): string {
    const m = /\(\)=>(.*)/.exec(
      getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, '')
    );

    if (!m) {
      throw new Error(
        "The function does not contain a statement matching 'return variableName;'"
      );
    }

    const fullMemberName = m[1];

    const memberParts = fullMemberName.split('.');

    return memberParts[memberParts.length - 1];
  }

  public validateColumnId(column: string): boolean {
    return /[Id/]/.test(column);
  }

  public validateRemoveRelationShip(value: any): boolean {
    return value === '' || value === null;
  }

  public isBigInt(string: string): boolean {
    try {
      return !!BigInt(string);
    } catch (e) {
      return false;
    }
  }

  public checkEmpty(detail: any, payload: any, field: string) {
    return typeof payload[field] !== 'undefined' &&
      (!payload[field] || payload[field])
      ? payload[field]
      : detail[field] === null
      ? ''
      : detail[field];
  }

  public checkEmptyField(detail: any, payload: any, field: string) {
    if (
      typeof payload[field] !== 'undefined' &&
      (!payload[field] || payload[field])
    ) {
      if (detail[field] !== payload[field]) {
        return true;
      }
      return false;
    }
    return false;
  }

  public checkEmptyOther(value: string, payload: any, field: string) {
    return typeof payload[field] !== 'undefined' &&
      (!payload[field] || payload[field])
      ? payload[field]
      : value === null
      ? ''
      : value;
  }

  public logScreenData(message: string) {
    // console.log(message);
  }

  public bigIntToHex(bn: string) {
    const pos = true;

    let hex = BigInt(bn).toString(16);
    if (hex.length % 2) {
      hex = '0' + hex;
    }

    if (pos && 0x80 & parseInt(hex.slice(0, 2), 16)) {
      hex = '00' + hex;
    }

    return hex;
  }

  public hexToBigInt(hex: string) {
    if (hex.length % 2) {
      hex = '0' + hex;
    }

    const highbyte = parseInt(hex.slice(0, 2), 16);
    let bn = BigInt('0x' + hex);

    if (0x80 & highbyte) {
      // You'd think `bn = ~bn;` would work... but it doesn't

      // manually perform two's compliment (flip bits, add one)
      // (because JS binary operators are incorrect for negatives)
      bn =
        BigInt(
          '0b' +
            bn
              .toString(2)
              .split('')
              .map(function (i) {
                return '0' === i ? 1 : 0;
              })
              .join('')
        ) + BigInt(1);
      bn = -bn;
    }

    return bn;
  }
}
