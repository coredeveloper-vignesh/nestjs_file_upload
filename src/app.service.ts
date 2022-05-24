import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadDto } from './file-upload.dto';
import { FileUpload } from './file-upload.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(FileUpload, 'file_upload')
    @InjectConnection('file_upload')
    private readonly _fileUpload: Repository<FileUpload>,
  ) {}
  async create(fileUploadDto: FileUploadDto) {
    try {
      await this._fileUpload.save(fileUploadDto);
    } catch (e) {}
  }
}
