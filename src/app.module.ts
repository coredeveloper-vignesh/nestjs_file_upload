import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUpload } from './file-upload.entity';
import { typeormOrmConfig } from './typeorm.config';

@Module({
  imports: [
    MulterModule.register({
      dest: './assets/uploads/',
    }),
    TypeOrmModule.forRoot(
      typeormOrmConfig('file_upload', { name: 'file_upload' }),
    ),
    TypeOrmModule.forFeature([FileUpload], 'file_upload'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
