import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from '@entities/profile.entity';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [SequelizeModule.forFeature([Profile])],
  exports: [ProfileService],
})
export class ProfileModule {}
