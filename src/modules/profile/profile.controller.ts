import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, ProfileResponseProps, UpdateProfileDto } from './profile.dto';
import { Profile } from '@entities/profile.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Profile creation' })
  @ApiCreatedResponse({
    status: 201,
    type: Number,
    description: 'Returns ID of created profile',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Profile can not be created',
  })
  @Post()
  public async createProfile(@Body() dto: CreateProfileDto): Promise<number> {
    return this.profileService.createProfile(dto);
  }

  @ApiOperation({ summary: 'Getting all profiles' })
  @ApiFoundResponse({
    status: 200,
    type: () => [Profile],
    description: 'Returns all profiles',
  })
  @Get()
  public async getAllProfiles(): Promise<Profile[]> {
    return this.profileService.getAllProfiles();
  }

  @ApiOperation({ summary: 'Getting profile with requested ID' })
  @ApiFoundResponse({
    status: 200,
    type: ProfileResponseProps,
    description: 'Returns required for authorization profile properties',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Profile with requested ID is not found',
  })
  @Get(':id')
  public async getProfileById(@Param('id') id: string): Promise<ProfileResponseProps> {
    return this.profileService.getProfilePropsById(id);
  }

  @ApiOperation({ summary: 'Updating profile with requested ID', })
  @ApiOkResponse({
    status: 200,
    type: () => Profile,
    description: 'Returns updated profile',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Profile with requested ID could not be updated',
  })
  @Put(':id')
  public async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.updateProfile(id, dto);
  }

  @ApiOperation({ summary: 'Deleting profile with requested ID' })
  @ApiOkResponse({
    type: Number,
    description: 'Returns ID of deleted profile',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Profile with requested ID could not be deleted',
  })
  @Delete(':id')
  public async deleteProfile(@Param('id') id: string): Promise<number> {
    return this.profileService.deleteProfile(id);
  }
}
