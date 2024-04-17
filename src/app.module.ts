import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModule } from '@modules/profile/profile.module';
import { dbConnectionOptions } from '@db';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => dbConnectionOptions,
    }),
    ProfileModule,
  ],
})
export class AppModule {}
