import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile } from '../../db/entities/profile.entity';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [SequelizeModule.forFeature([Profile])],
  exports: [ProfileService],
})
export class ProfileModule {}
