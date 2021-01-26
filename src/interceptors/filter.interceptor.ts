import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
// TODO: Look for another possible solution with TS
const { SPFDefaultParams, SensitiveParamFilter } = require('@amaabca/sensitive-param-filter')

const paramFilter = new SensitiveParamFilter({
  params: SPFDefaultParams.concat(['password']),
  whitelist: ['token']
});

@Interceptor()
export class FilterParamInterceptor implements InterceptorInterface {
  intercept(_action: Action, content: any) {
    return paramFilter.filter(content);
  }
}
