import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '@entities/profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import * as bcrypt from 'bcryptjs';
import { SALT } from '@config';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private readonly profileRepo: typeof Profile) {}

  public async createProfile(dto: CreateProfileDto) {
    if (!dto.email) {
      const createdGuest = await this.profileRepo.create(dto);

      return createdGuest.id;
    }

    const candidate = await this.getProfileByEmail(dto.email);

    if (candidate) {
      throw new HttpException('Profile already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(dto.password, Number(SALT));
    const userToCreate = { ...dto, password: hashPassword };
    const createdUser = await this.profileRepo.create(userToCreate);

    return createdUser.id;
  }

  public async getAllProfiles() {
    const foundProfiles = await this.profileRepo.findAll();

    return foundProfiles;
  }

  public async getProfilePropsById(id: string) {
    const foundProfile = await this.getProfileById(id);

    const foundProfileProps = {
      id: foundProfile.id,
      password: foundProfile.password,
      alg: 'bcrypt',
      roles: foundProfile.roles,
    };

    return foundProfileProps;
  }

  public async getProfileByEmail(email: string) {
    const foundProfile = await this.profileRepo.findOne({
      where: {
        email,
      },
    });

    return foundProfile;
  }

  public async updateProfile(id: string, dto: UpdateProfileDto) {
    const foundProfile = await this.getProfileById(id);

    const hashPassword = await bcrypt.hash(dto.password, Number(SALT));

    const updatedProfile = await foundProfile.update({ ...dto, password: hashPassword });

    return updatedProfile;
  }

  public async deleteProfile(id: string) {
    const foundProfile = await this.getProfileById(id);

    await foundProfile.destroy();

    return foundProfile.id;
  }

  private async getProfileById(id: string) {
    const foundProfile = await this.profileRepo.findByPk(id);

    if (!foundProfile) throw new NotFoundException('Profile with this ID is not found!');

    return foundProfile;
  }
}
