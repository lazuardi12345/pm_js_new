import { Test, TestingModule } from '@nestjs/testing';
import { RepeatOrdersController } from './repeat-orders.controller';

describe('RepeatOrdersController', () => {
  let controller: RepeatOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepeatOrdersController],
    }).compile();

    controller = module.get<RepeatOrdersController>(RepeatOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
