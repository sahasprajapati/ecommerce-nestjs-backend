import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/utility/decorator/auth.decorator';
import { User } from 'src/utility/decorator/user.decorator';
import { PaginatedResultDto } from 'src/utility/dto/paginated-result.dto';
import { PaginationDto } from './../../utility/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto<Product[]>> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    const data = this.productsService.findAll({
      ...paginationDto,
      limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
    });
    console.log(await data);
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Auth()
  create(
    @User('id') createdBy: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createdBy, createProductDto);
  }

  @Patch(':id')
  @Auth()
  update(
    @User('id') updatedBy: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(updatedBy, id, updateProductDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
