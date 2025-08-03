export const objectToFormData = (object: { [propName: string]: any }) => {
    const formdata = new FormData()
    Object.entries(object).forEach(([key, value]) => {
      if (value instanceof Array) {
        value.forEach(value => formdata.append(key, value))
      } else {
        formdata.append(key, value)
      }
    })
    return formdata
}