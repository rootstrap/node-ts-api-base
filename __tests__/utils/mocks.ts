import { Response, Request } from 'express';
import { UpdateResult } from 'typeorm';

export const mockResponse: Partial<Response> = {
  send: jest.fn().mockImplementation( result => result),
  json: jest.fn().mockImplementation( result => result)
};

export const mockRequest: Partial<Request> = {
  body: {}
};

export const mockUpdateResult: Partial<UpdateResult> = {

};
