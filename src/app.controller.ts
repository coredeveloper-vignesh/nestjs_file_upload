import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';

import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ApiFile } from './api-file.decorators';
import { ApiMultiFile } from './api-multifile.decorators';

// Check file type
const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

// Change File name
const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

// Create Dynamic Directory
const basePath = './src/assets/uploads';

const destination = (req, file, callback) => {
  const customer_dir = basePath + '/' + req.body.customer_id;
  const user_dir =
    basePath + '/' + req.body.customer_id + '/' + req.body.user_id + '/';

  if (!fs.existsSync(user_dir)) {
    if (!fs.existsSync(customer_dir)) fs.mkdirSync(customer_dir);
    if (!fs.existsSync(user_dir)) fs.mkdirSync(user_dir);
  }
  return callback(null, user_dir);
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Single file upload
  @Post('single')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destination,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerData: any,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    const data = await {
      user_id: registerData.user_id,
      customer_id: registerData.customer_id,
      image_name: file.filename,
    };
    this.appService.create(data);
    return response;
  }

  // Mult file upload
  @Post('multiple')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()

  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       user_id: { type: 'number' },
  //       customer_id: { type: 'string' },
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @UseInterceptors(
    FilesInterceptor('choose_files', 20, {
      storage: diskStorage({
        destination: destination,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() registerData: any,
  ) {
    const response = [];
    const files_name: any[] = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      files_name.push(file.filename);
      response.push(fileReponse);
    });

    const data = await {
      user_id: registerData.user_id,
      customer_id: registerData.customer_id,
      image_name: files_name.toString(),
    };
    this.appService.create(data);
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(
    @Param('imgpath') image: string,
    @Res() res,
    @Query('customer_id') customer_id: string,
    @Query('user_id') user_id: string,
  ) {
    try {
      const customer_dir = basePath + '/' + customer_id;
      const user_dir = basePath + '/' + customer_id + '/' + user_id + '/';

      if (!fs.existsSync(customer_dir) && !fs.existsSync(user_dir)) {
        throw new NotFoundException();
      }

      return res.sendFile(image, {
        // root: `${basePath}/${customer_id}/${user_id}/`,
        root: user_dir,
      });
    } catch (error) {
      throw error.response;
    }
  }

  // @Post('/upload')
  // @ApiConsumes('multipart/form-data')
  // @ApiMultiFile()
  // @UseInterceptors(FilesInterceptor('files'))
  // uploadsMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }
}
