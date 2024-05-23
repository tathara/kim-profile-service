import { Column, DataType, Table, Model } from 'sequelize-typescript';
import { Roles } from '../../enums';
import { ApiProperty } from '@nestjs/swagger';

interface IProfileProps {
  name: string;
}

@Table({ tableName: 'profile' })
export class Profile extends Model<Profile> {
  @ApiProperty({
    type: Number,
    description: 'Users\'s profile ID',
    example: 1337,
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Users\'s profile full name',
    example: 'Stepanenko Ryan Gosling',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Users\'s profile email',
    example: 'ryan.gosling@gmail.com',
  })
  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Users\'s profile password',
    example: 'Gosling2007',
  })
  @Column({ type: DataType.STRING })
  password: string;

  @ApiProperty({
    enum: Roles,
    description: 'Users\'s profile array of roles',
    example: [Roles.TEACHER, Roles.TESTER],
  })
  @Column({ type: DataType.ARRAY(DataType.ENUM(...Object.values(Roles))), allowNull: false })
  roles: Roles[];
}
