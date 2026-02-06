import { Test, TestingModule } from '@nestjs/testing';
import { ViewController } from './view.controller';
import { FilesService } from '../files/files.service';

describe('ViewController', () => {
  let controller: ViewController;

  beforeEach(async () => {
    const filesServiceMock = {
      getFileInfo: jest.fn().mockResolvedValue(null),
    } as Partial<FilesService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewController],
      providers: [
        { provide: FilesService, useValue: filesServiceMock },
      ],
    }).compile();

    controller = module.get<ViewController>(ViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
