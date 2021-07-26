import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  public async getAll() {
    return await this.repo.find();
  }

  public async create(
    dto: CategoryDTO,
    // , user: User
  ): Promise<CategoryDTO> {
    const category = new Category();
    category.name = dto.name;
    category.description = dto.description;

    return this.repo.save(category);
  }
}
