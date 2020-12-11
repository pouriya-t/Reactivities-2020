import React from "react";
import { Form, Label } from "semantic-ui-react";
import { DateTimePicker } from "react-widgets";

const DateInput = ({
  input,
  width,
  type,
  placeholder,
  date = false,
  time = false,
  meta: { touched, error },
  rest,
}) => {
  return (
    <Form.Field error={touched && !!error} type={type} width={width}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        {...rest}
        date={date}
        time={time}
      />
      {/* <DateTimePicker defaultValue={new Date()} /> */}
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
