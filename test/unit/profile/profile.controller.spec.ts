import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileController } from '../../../src/modules/profile/profile.controller';
import { ProfileService } from '../../../src/modules/profile/profile.service';
import { Profile } from '../../../src/db/entities/profile.entity';
import { dbConnectionOptions } from '../../dbconfig.test';
import { CreateProfileDto, UpdateProfileDto } from '../../../src/modules/profile/profile.dto';
import { Roles } from '../../../src/enums';
import { Sequelize } from 'sequelize-typescript';

describe('Profile Controller', () => {
  let profileController: ProfileController;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(dbConnectionOptions),
        SequelizeModule.forFeature([Profile]),
      ],
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
    sequelize = module.get(Sequelize);
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('createProfile', () => {
    it('should create a profile and return its ID', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Stepanenko Ryan Gosling',
        email: 'ryan.gosling@gmail.com',
        password: 'Gosling2007',
        roles: [Roles.TEACHER, Roles.TESTER],
      };

      const profile = await profileController.createProfile(createProfileDto);
      expect(profile).toBe(1);
    });

    it('should throw an error if a profile with the same email already exists', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Stepanenko Ryan Gosling',
        email: 'ryan.gosling@gmail.com',
        password: 'Gosling2007',
        roles: [Roles.TEACHER, Roles.TESTER],
      };

      await profileController.createProfile(createProfileDto);

      await expect(profileController.createProfile(createProfileDto)).rejects.toThrowError(
        'Profile already exists',
      );
    });
  });

  describe('getAllProfiles', () => {
    it('should return an array of profiles', async () => {
      const profile = await Profile.create({
        name: 'Stepanenko Ryan Gosling',
        email: 'ryan.gosling@gmail.com',
        password: 'Gosling2007',
        roles: [Roles.TEACHER, Roles.TESTER],
      });

      const profiles = await profileController.getAllProfiles();
      expect(profiles).toHaveLength(1);
      expect(profiles[0].email).toBe(profile.email);
    });
  });

  describe('getProfileById', () => {
    it('should return the profile properties by ID', async () => {
      const profile = await Profile.create({
        name: 'Stepanenko Ryan Gosling',
        email: 'ryan.gosling@gmail.com',
        password: 'Gosling2007',
        roles: [Roles.TEACHER, Roles.TESTER],
      });

      const profileResponse = await profileController.getProfileById(profile.id.toString());
      expect(profileResponse.roles).toEqual(profile.roles);
      expect(profileResponse.alg).toBe('bcrypt');
    });
  });

  describe('updateProfile', () => {
    it('should update and return the profile', async () => {
      const profile = await Profile.create({
        name: 'Stepanenko Ryan Gosling',
        email: 'ryan.gosling@gmail.com',
        password: 'Gosling2007',
        roles: [Roles.TEACHER, Roles.TESTER],
      });

      const updateProfileDto: UpdateProfileDto = {
        id: profile.id,
        name: 'Updated Name',
        email: 'updated.email@gmail.com',
        password: 'UpdatedPassword',
        roles: [Roles.ADMIN],
      };

      const updatedProfile = await profileController.updateProfile(
        profile.id.toString(),
        updateProfileDto,
      );
      expect(updatedProfile.name).toBe(updateProfileDto.name);
      expect(updatedProfile.email).toBe(updateProfileDto.email);
    });
  });

  describe('deleteProfile', () => {
    it('should delete the profile and return its ID', async () => {
      const profile = await Profile.create({
        name: 'Stepanenko Ryan Gosling',
        email: 'ryan.gosling@gmail.com',
        password: 'Gosling2007',
        roles: [Roles.TEACHER, Roles.TESTER],
      });

      const deletedProfileId = await profileController.deleteProfile(profile.id.toString());
      expect(deletedProfileId).toBe(profile.id);
    });
  });
});
