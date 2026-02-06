import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { SupabaseService } from '../storage/supabase/supabase.service';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const supabaseMock = {
      uploadFile: jest.fn().mockResolvedValue({ url: 'http://example.com', path: 'uploads/file' }),
      saveFileMetadata: jest.fn().mockResolvedValue({ success: true }),
      getFileById: jest.fn().mockResolvedValue(null),
      incrementViewCount: jest.fn(),
    } as Partial<SupabaseService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
