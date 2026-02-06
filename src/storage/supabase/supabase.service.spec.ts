import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    dotenv.config({ path: path.join(__dirname, '../../../env/.env') });
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
