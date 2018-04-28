
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { ResponseContentType } from '@angular/http/src/enums';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { CORE_SETTINGS } from '../../core.settings.constants';
import { CoreSettings } from '../../core.settings';

@Injectable()
export class ResponseHandlerService {

    constructor(
        @Inject(CORE_SETTINGS) public settings: CoreSettings
    ) { }

    handleSuccess(response: Response, responseContentType?: ResponseContentType): any {
        let responseType = ResponseContentType.Json;

        if(responseContentType != null && responseContentType != responseType) {
            responseType = responseContentType;
        }

        switch (responseType) {
            case ResponseContentType.ArrayBuffer:
                return response.arrayBuffer();
            case ResponseContentType.Blob:
                return response.blob();
            case ResponseContentType.Text:
                return response.text();
            default:
                return response.json();
        }
    }
    handleError(response: Response): ErrorObservable {
        let error: any;

        if (response.status === 400) {
            const responseBody = response.json();

            if (responseBody.error instanceof Object) {
                error = responseBody.error;
            } else if (responseBody.error && responseBody.error_description) {
                error = {
                    title: responseBody.error,
                    message: responseBody.error_description
                };
            } else {
                error = this.getDefaultErrorObject();
            }
        } else {
            error = this.getDefaultErrorObject();
        }

        return Observable.throw(error);
    }

    private getDefaultErrorObject(): any {
        return {
            title: this.settings.errorHandlingSettings.unhandledErrorTitle,
            message: this.settings.errorHandlingSettings.unhandledErrorMessage
        };
    }

}
