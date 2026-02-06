import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { InvitesService } from '../invites/invites.service';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const filesServiceMock = {
      uploadFile: jest.fn().mockResolvedValue({ fileId: 'id', fileName: 'name', fileUrl: 'url' }),
    } as Partial<FilesService>;
    const invitesServiceMock = {
      validateCode: jest.fn().mockResolvedValue({ valid: true }),
    } as Partial<InvitesService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        { provide: FilesService, useValue: filesServiceMock },
        { provide: InvitesService, useValue: invitesServiceMock },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
