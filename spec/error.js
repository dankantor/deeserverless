import {ValidationError, AuthenticationError, NotFoundError, PermissionError, BadgatewayError} from './../lib/error.js';

describe('#Error', () => {

  it('returns the correct ValidationError output', () => {
    try {
      throw new ValidationError({
        message: "Here is a custom validation error message",
        $metadata: {httpStatusCode: 400}
      });
    } catch (err) {
      expect(err.message).toEqual("Here is a custom validation error message");
      expect(err.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('returns the correct ValidationError output when a custom message is not set', () => {
    try {
      throw new ValidationError({
        $metadata: {httpStatusCode: 400}
      });
    } catch (err) {
      expect(err.message).toEqual("Validation Error");
      expect(err.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('returns the correct ValidationError output when an httpStatusCode is not set', () => {
    try {
      throw new ValidationError();
    } catch (err) {
      expect(err.message).toEqual("Validation Error");
      expect(err.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('returns the correct AuthenticationError output', () => {
    try {
      throw new AuthenticationError();
    } catch (err) {
      expect(err.message).toEqual("Authentication Error");
      expect(err.$metadata.httpStatusCode).toEqual(401);
    }
  });

  it('returns the correct AuthenticationError output when a custom message is set', () => {
    try {
      throw new AuthenticationError({
        message: "Here is a custom authentication error message",
      });
    } catch (err) {
      expect(err.message).toEqual("Here is a custom authentication error message");
      expect(err.$metadata.httpStatusCode).toEqual(401);
    }
  });

  it('honors custom $metadata for AuthenticationError, NotFoundError, PermissionError, and BadgatewayError', () => {
    expect(new AuthenticationError({$metadata: {httpStatusCode: 407}}).$metadata.httpStatusCode).toEqual(407);
    expect(new NotFoundError({$metadata: {httpStatusCode: 410}}).$metadata.httpStatusCode).toEqual(410);
    expect(new PermissionError({$metadata: {httpStatusCode: 451}}).$metadata.httpStatusCode).toEqual(451);
    expect(new BadgatewayError({$metadata: {httpStatusCode: 504}}).$metadata.httpStatusCode).toEqual(504);
  });

  it('returns the correct NotFoundError output', () => {
    try {
      throw new NotFoundError();
    } catch (err) {
      expect(err.message).toEqual("Not Found");
      expect(err.$metadata.httpStatusCode).toEqual(404);
    }
  });

  it('returns the correct NotFoundError output when a custom message is set', () => {
    try {
      throw new NotFoundError({
        message: "Here is a custom not found error message",
      });
    } catch (err) {
      expect(err.message).toEqual("Here is a custom not found error message");
      expect(err.$metadata.httpStatusCode).toEqual(404);
    }
  });

  it('returns the correct PermissionError output', () => {
    try {
      throw new PermissionError();
    } catch (err) {
      expect(err.message).toEqual("Permission Error");
      expect(err.$metadata.httpStatusCode).toEqual(403);
    }
  });

  it('returns the correct PermissionError output when a custom message is set', () => {
    try {
      throw new PermissionError({
        message: "Here is a custom permission error message",
      });
    } catch (err) {
      expect(err.message).toEqual("Here is a custom permission error message");
      expect(err.$metadata.httpStatusCode).toEqual(403);
    }
  });

  it('returns the correct BadgatewayError output', () => {
    try {
      throw new BadgatewayError();
    } catch (err) {
      expect(err.message).toEqual("Bad Gateway Error");
      expect(err.$metadata.httpStatusCode).toEqual(502);
    }
  });

  it('returns the correct BadgatewayError output when a custom message is set', () => {
    try {
      throw new BadgatewayError({
        message: "Here is a custom bad gateway error message",
      });
    } catch (err) {
      expect(err.message).toEqual("Here is a custom bad gateway error message");
      expect(err.$metadata.httpStatusCode).toEqual(502);
    }
  });

});
