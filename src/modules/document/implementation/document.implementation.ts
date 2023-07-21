import * as moment from 'moment';
import { extname } from 'path';
import { FastifyRequest } from 'fastify';
import { BadRequestException } from '@nestjs/common';

export const buildFileName = (req: FastifyRequest, file: any, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(
    null,
    `${moment().format('YYYY/MM/DD')}/${name
      .replace(/([^a-z0-9]+)/gi, '-')
      .toLowerCase()}-${randomName}${fileExtName}`
  );
};

export const imageFileFilter = (req: FastifyRequest, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|txt)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false
    );
  }
  callback(null, true);
};
