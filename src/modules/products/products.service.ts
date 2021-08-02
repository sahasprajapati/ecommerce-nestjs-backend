import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResultDto } from 'src/utility/dto/paginated-result.dto';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { UserService } from '../user/user.service';
import { PaginationDto } from './../../utility/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UserService,
    private readonly imageService: ImageService,
  ) {}

  async create(createdBy: string, productDto: CreateProductDto) {
    const product = new Product();
    product.name = productDto.name;
    product.price = productDto.price;
    product.isActive = !!productDto.isActive;

    const creator = await this.usersService.findForId(createdBy);
    product.createdBy = creator;
    product.updatedBy = creator;

    product.images = await this.imageService.upload(productDto.images);

    console.log(product);

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
      .leftJoinAndSelect('product.images', 'image')
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
      where: {
        id: id,
      },
      relations: ['images'],
    });
  }

  async update(
    updatedBy: string,
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsRepository.findOne({ id: id });
    const { images, ...data } = updateProductDto;

    product.name = data.name;
    product.price = data.price;
    product.updatedBy = await this.usersService.findForId(updatedBy);
    product.isActive = !!data.isActive;

    const resultProduct = await this.productsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['images'],
    });
    const ids = resultProduct.images.map((image) => image.fileId);

    product.images = await this.imageService
      .update(images, ids)
      .catch((error: Error) => {
        this.logger.error(error, error.stack);
        return [];
      });

    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const result = await this.productsRepository.findOne({
      id: id,
    });

    this.imageService.deleteAll(...result.images.map((image) => image.fileId));

    return this.productsRepository.delete({ id: id });
  }
}
