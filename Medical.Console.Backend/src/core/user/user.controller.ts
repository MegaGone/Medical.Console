import { UserService } from './user.service';
import { BcryptService } from '../shared/services';
import { Controller, Post, Body, Get, Param, Delete, Put, Query, BadRequestException } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto, FindUserByIDto, FindUsersPaginatedDto, UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly _service: UserService,
  ) {}

  @Post("/create")
  public async create(@Body() createUserDto: CreateUserDto) {
    const existEmail = await this._service.emailIsAlreadyUsed(createUserDto.email);
    if (existEmail)
      throw new BadRequestException("Email already in use.")

    const stored = await this._service.create({
      ...createUserDto,
      password: await BcryptService.hash(createUserDto.password)
    });

    return { stored }
  }

  @Get("/findPaginated")
  findAll(@Query() findUsersPaginatedDto: FindUsersPaginatedDto) {
    return this._service.findPaginated(findUsersPaginatedDto.page, findUsersPaginatedDto.pageSize);
  }

  @Get('/findById/:id')
  findOne(@Param() findUserByIDto: FindUserByIDto) {
    const { id } = findUserByIDto;
    return this._service.findOneById(id);
  }

  @Put('/update')
  public async update(@Body() updateUserDto: UpdateUserDto) {
    const { id, ...body } = updateUserDto; 
    const updated = await this._service.update(id, body);
    return { updated }
  }

  @Delete('/delete/:id')
  public async remove(@Param() deleteUserDto: DeleteUserDto) {
    const { id } = deleteUserDto;
    const deleted = await this._service.disable(id);
    return { deleted };
  }
}
