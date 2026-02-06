import { Test, TestingModule } from '@nestjs/testing';
import { InvitesService } from './invites.service';
import { SupabaseService } from '../storage/supabase/supabase.service';

describe('InvitesService', () => {
  let service: InvitesService;

  beforeEach(async () => {
    const supabaseMock = {
      validateInviteCode: jest.fn().mockResolvedValue({ valid: true, code: 'ABC', usesLeft: 4 }),
    } as Partial<SupabaseService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitesService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<InvitesService>(InvitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
