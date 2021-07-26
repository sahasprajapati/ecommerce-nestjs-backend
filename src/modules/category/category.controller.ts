import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private service: CategoryService) {}

  /**
   * @example ['admin']
   *
   */
  @Get()
  async getAll(): Promise<CategoryDTO[]> {
    return await this.service.getAll();
  }

  @Post()
  public async createCategory(
    // @User() user: User,
    @Body() dto: CategoryDTO,
  ): Promise<CategoryDTO> {
    return this.service.create(
      dto,
      // , user
    );
  }
}
