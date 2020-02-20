import { expect } from 'chai'
import { AmplitudeErrorResponse, axiosErrorCatcher } from '../src/errors'

interface MockAxiosError extends Error {
  response?: {
    status: number;
  };
}

describe('errors', () => {
  it('catches axios response errors', async () => {
    const err: MockAxiosError = new Error('some error with response')
    err.response = {
      status: 500
    }

    let caughtErr
    try {
      await axiosErrorCatcher(Promise.reject(err))
    } catch (e) {
      caughtErr = e
    }

    expect(caughtErr.status).to.eq(500)
    expect(caughtErr).to.be.instanceof(AmplitudeErrorResponse)
  })

  it('catches non axios errors', async () => {
    const err = new Error('some std error')

    let caughtErr
    try {
      await axiosErrorCatcher(Promise.reject(err))
    } catch (e) {
      caughtErr = e
    }

    expect(caughtErr.status).to.be.undefined
    expect(caughtErr.message).to.eq('some std error')
  })
})