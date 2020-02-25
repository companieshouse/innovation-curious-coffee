import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Request, Response, NextFunction} from 'express';
import * as _ from 'express-validator';

_;

import {checkValidation} from '../../src/feedback/validation';

const expect = chai.expect;
chai.use(sinonChai);

describe("feedback/validation.ts", () => {
    describe("checkValidation", () => {
        it("re-renders the feedback page with an appropriate error when invalid data (email format) is passed to it", () => {
            const errors: string[] = ["foo", "bar"];
            const mockRequest: Partial<Request> = {
                body: {
                    feedbackModel: {
                        email: "foo", //invalid format, should be foo@bar.com
                        feedback: "some feedback"
                    }
                },
                validationErrors: sinon.spy(() => {
                    return errors;
                })
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const mockNext: Partial<NextFunction> = {};

            checkValidation(
                mockRequest as Request,
                mockResponse as Response,
                mockNext as NextFunction
            );

            expect(mockRequest.validationErrors).to.have.been.calledOnce;

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("feedback", {
                feedbackModel: mockRequest.body.feedbackModel,
                errors: errors
            });
        });

        it("re-renders the feedback page with an appropriate error when invalid data (no feedback) is passed to it", () => {
            const errors: string[] = ["foo", "bar"];
            const mockRequest: Partial<Request> = {
                body: {
                    feedbackModel: {
                        email: "foo@bar.com",
                        feedback: ""
                    }
                },
                validationErrors: sinon.spy(() => {
                    return errors;
                })
            };

            const mockResponse: Partial<Response> = {
                render: sinon.spy()
            };

            const mockNext: Partial<NextFunction> = {};

            checkValidation(
                mockRequest as Request,
                mockResponse as Response,
                mockNext as NextFunction
            );

            expect(mockRequest.validationErrors).to.have.been.calledOnce;

            expect(mockResponse.render).to.have.been.calledOnce;
            expect(mockResponse.render).to.have.been.calledWith("feedback", {
                feedbackModel: mockRequest.body.feedbackModel,
                errors: errors
            });
        });
    });
});