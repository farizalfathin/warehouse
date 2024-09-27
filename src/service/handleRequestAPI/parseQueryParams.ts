const parseQueryParamWithOperator = (param: string) => {
    const match = param.match(/(<=|>=|<|>)(\d+)/);
    if (match) {
      return { operator: match[1], value: parseFloat(match[2]) };
    }
    return { operator: '=', value: parseFloat(param) };
};

export default parseQueryParamWithOperator;