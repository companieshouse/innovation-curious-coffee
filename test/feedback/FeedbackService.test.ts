import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Request, Response} from 'express';

import FeedbackService from '../../src/feedback/FeedbackService';
import {FeedbackRepository} from '../../src/feedback/FeedbackRepository';

const expect = chai.expect;
chai.use(sinonChai);

describe("FeedbackService", () => {

    describe("get", () => {
        it("tries to render the feedback page", () => {
            const mockRequest: Partial<Request> = {
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const mockRepository: Partial<FeedbackRepository> = {
            };

            const feedbackService = new FeedbackService(mockRepository as FeedbackRepository);

            feedbackService.get(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("feedback");
        });
    });

    describe("post", () => {
        it("calls save on the repository when valid data is provided", () => {
            const mockRequest: Partial<Request> = {
                body: {
                    feedbackModel: {
                        email: "foo@bar.com",
                        feedback: "some feedback"
                    }
                },
                flash: sinon.spy()
            };

            const mockResponse: Partial<Response> = {
                redirect: sinon.spy()
            };

            const mockRepository: Partial<FeedbackRepository> = {
                save: sinon.spy()
            };

            const feedbackService = new FeedbackService(mockRepository as FeedbackRepository);
            
            feedbackService.post(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockRepository.save).to.have.been.calledOnce;
            expect(mockRepository.save).to.have.been.calledWith(mockRequest.body.feedbackModel);

            expect(mockRequest.flash).to.have.been.calledOnce;
            expect(mockRequest.flash).to.have.been.calledWith("info", "Thank you for your feedback!");

            expect(mockResponse.redirect).to.have.been.calledOnce;
            expect(mockResponse.redirect).to.have.been.calledWith("/");
        });
    });
});