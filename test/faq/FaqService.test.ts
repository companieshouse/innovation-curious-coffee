import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Request, Response} from 'express';

import FaqService from '../../src/faq/FaqService';

const expect = chai.expect;
chai.use(sinonChai);

describe("faq/FaqService", () => {
    describe("get", () => {
        it("renders the faq page", () => {
            const mockRequest: Partial<Request> = {
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const faqService = new FaqService();

            faqService.get(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("faq");
        });
    });
});