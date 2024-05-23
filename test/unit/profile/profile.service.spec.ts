import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileService } from '../../../src/modules/profile/profile.service';
import { Profile } from '../../../src/db/entities/profile.entity';
import { dbConnectionOptions } from '../../dbconfig.test';
import { CreateProfileDto, UpdateProfileDto } from '../../../src/modules/profile/profile.dto';
import { Roles } from '../../../src/enums';
import * as bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize-typescript';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let sequelize: Sequelize; 

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot(dbConnectionOptions),
        SequelizeModule.forFeature([Profile]),
      ],
      providers: [ProfileService], 
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    sequelize = module.get(Sequelize); 
    
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('createProfile', () => {
    it('should create a guest profile (no email provided)', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Guest User',
        password: 'somePassword', 
        roles: [Roles.GUEST],
      };

      const profileId = await profileService.createProfile(createProfileDto);
      expect(profileId).toBeDefined(); 
    });

    it('should create a user profile with email and hashed password', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword',
        roles: [Roles.GUEST],
      };

      const profileId = await profileService.createProfile(createProfileDto);
      expect(profileId).toBeDefined();

      const profile = await Profile.findByPk(profileId);
      expect(profile).toBeDefined();
      expect(profile.email).toBe(createProfileDto.email);
      expect(await bcrypt.compare(createProfileDto.password, profile.password)).toBe(true); 
    });

    it('should throw an error if a profile with the same email already exists', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Duplicate Email User',
        email: 'duplicate@example.com',
        password: 'somePassword',
        roles: [Roles.GUEST],
      };

      await profileService.createProfile(createProfileDto); 
      await expect(profileService.createProfile(createProfileDto)).rejects.toThrowError(
        'Profile already exists',
      );
    });
  });

  describe('getAllProfiles', () => {
    it('should return an array of profiles', async () => {
      const profiles = await profileService.getAllProfiles();
      expect(Array.isArray(profiles)).toBe(true);
    });
  });

  describe('getProfilePropsById', () => {
    it('should return profile properties by ID', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Profile Props Test User',
        email: 'props@example.com',
        password: 'somePassword',
        roles: [Roles.GUEST],
      };
      const profileId = await profileService.createProfile(createProfileDto);

      const profileProps = await profileService.getProfilePropsById(profileId.toString());
      expect(profileProps.id).toBe(profileId);
      expect(profileProps.alg).toBe('bcrypt');
    });

    it('should throw an error if profile is not found', async () => {
      await expect(profileService.getProfilePropsById('invalid-id')).rejects.toThrowError(
        'Profile with this ID is not found!', 
      );
    });
  });

  describe('getProfileByEmail', () => {
    it('should return a profile by email', async () => {
      const email = 'findbyemail@example.com';
      await Profile.create({ 
        name: 'Email Test User', 
        email: email, 
        password: 'somePassword', 
        roles: [Roles.GUEST] 
      });

      const profile = await profileService.getProfileByEmail(email);
      expect(profile).toBeDefined();
      expect(profile.email).toBe(email);
    });

    it('should return null if profile with the email is not found', async () => {
      const profile = await profileService.getProfileByEmail('nonexistent@example.com');
      expect(profile).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update a profile', async () => {
      const createDto: CreateProfileDto = {
        name: 'Update Test User',
        email: 'update@example.com',
        password: 'oldPassword',
        roles: [Roles.GUEST],
      };
      const profileId = await profileService.createProfile(createDto);

      const updateDto: UpdateProfileDto = {
        id: profileId,
        name: 'Updated Name',
        email: 'updated@example.com', 
        password: 'newPassword',
        roles: [Roles.ADMIN],
      };
      const updatedProfile = await profileService.updateProfile(profileId.toString(), updateDto);

      expect(updatedProfile.name).toBe(updateDto.name);
      expect(updatedProfile.email).toBe(updateDto.email); 
      expect(await bcrypt.compare(updateDto.password, updatedProfile.password)).toBe(true); 
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', async () => {
      const createProfileDto: CreateProfileDto = {
        name: 'Delete Test User',
        email: 'delete@example.com',
        password: 'somePassword',
        roles: [Roles.GUEST],
      };
      const profileId = await profileService.createProfile(createProfileDto);

      const deletedProfileId = await profileService.deleteProfile(profileId.toString());
      expect(deletedProfileId).toBe(profileId); 

      const profileAfterDeletion = await Profile.findByPk(profileId);
      expect(profileAfterDeletion).toBeNull(); 
    });
  }); 
});