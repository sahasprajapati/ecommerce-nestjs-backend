import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResultDto } from 'src/utility/dto/paginated-result.dto';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { PaginationDto } from './../../utility/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UserService,
  ) {}

  async create(createdBy: string, productDto: CreateProductDto) {
    const product = new Product();
    product.name = productDto.name;
    product.price = productDto.price;

    const creator = await this.usersService.findForId(createdBy);
    product.createdBy = creator;
    product.updatedBy = creator;
    return this.productsRepository.save(product);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto<Product[]>> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.productsRepository.count();
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .orderBy('product.dated.createdDateTime', 'DESC')
      .addOrderBy('product.dated.updatedDateTime', 'DESC')
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: products,
    };
  }

  findOne(id: string) {
    return this.productsRepository.findOne({
      id: id,
    });
  }

  async update(
    updatedBy: string,
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = new Product();
    product.name = updateProductDto.name;
    product.price = updateProductDto.price;
    product.updatedBy = await this.usersService.findForId(updatedBy);

    return this.productsRepository.update({ id }, updateProductDto);
  }

  remove(id: string) {
    return this.productsRepository.delete({ id: id });
  }
}
