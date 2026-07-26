import { Package } from '../entities/package.entity';

export interface IPackageRepository {
  findById(id: number): Promise<Package | null>;
  findAll(): Promise<Package[]>;
  create(data: Omit<Package, 'id'>): Promise<Package>;
  update(id: number, data: Partial<Omit<Package, 'id'>>): Promise<Package>;
  delete(id: number): Promise<boolean>;
}
