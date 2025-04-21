import React, { useState } from "react";

const PasswordInput = ({
  name,
  placeholder,
  refCallback,
  errors,
  register,
  className,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          id={name}
          ref={(r) => {
            if (refCallback) refCallback(r);
          }}
          className={`rounded-e-none ${className} ${
            errors && errors[name] ? "border-red-500 text-red-700 -me-px" : ""
          }`}
          {...(register ? register(name) : {})}
          {...otherProps}
          autoComplete={name}
        />
        {errors && errors[name] && (
          <div className="absolute end-10 flex items-center pointer-events-none pe-3">
            <i className="mgc_warning_fill text-xl text-red-500" />
          </div>
        )}
        <span
          className="flex items-center bg-slate-500/5 px-3 h-[38px] py-1 border rounded-e -ms-px dark:border-white/10 dark:bg-white/5"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i
            className={`mgc_${
              showPassword ? "eye_close_line" : "eye_line"
            } text-xl`}
          ></i>
        </span>
      </div>
      {errors && errors[name] && (
        <p className="text-xs text-red-600 mt-2">{errors[name]["message"]}</p>
      )}
    </>
  );
};

const FormInput = ({
  label,
  type,
  name,
  placeholder,
  register,
  errors,
  className,
  labelClassName,
  containerClass,
  refCallback,
  children,
  rows,
  otherComp,
  ...otherProps
}) => {
  const Tag =
    type === "textarea" ? "textarea" : type === "select" ? "select" : "input";
  return (
    <>
      {type === "hidden" ? (
        <input
          type={type}
          name={name}
          {...(register ? register(name) : {})}
          {...otherProps}
        />
      ) : (
        <>
          {type === "password" ? (
            <div className={`${containerClass ?? ""} relative`}>
              {label && (
                <>
                  <label className={labelClassName ?? ""} htmlFor={name}>
                    Password
                  </label>
                  {children}
                </>
              )}
              <PasswordInput
                name={name}
                placeholder={placeholder}
                refCallback={refCallback}
                errors={errors}
                register={register}
                className={className}
                {...otherProps}
              />
            </div>
          ) : (
            <>
              {type === "textarea" ? (
                <div className={`${containerClass ?? ""} relative`}>
                  {label && (
                    <label className={labelClassName ?? ""} htmlFor={name}>
                      {label}
                    </label>
                  )}
                  <Tag
                    placeholder={placeholder}
                    name={name}
                    id={name}
                    ref={(r) => {
                      if (refCallback) refCallback(r);
                    }}
                    className={`${className} ${
                      errors && errors[name]
                        ? "border-red-500 focus:border-red-500 text-red-700  pe-10"
                        : ""
                    }`}
                    {...(register ? register(name) : {})}
                    {...otherProps}
                    autoComplete={name}
                  />
                </div>
              ) : (
                <>
                  {type === "select" ? (
                    <div className={`${containerClass ?? ""} relative`}>
                      {label && (
                        <label className={labelClassName ?? ""} htmlFor={name}>
                          {label}
                        </label>
                      )}
                      <Tag
                        name={name}
                        id={name}
                        ref={(r) => {
                          if (refCallback) refCallback(r);
                        }}
                        className={`${className} ${
                          errors && errors[name]
                            ? "border-red-500 text-red-700"
                            : ""
                        }`}
                        {...(register ? register(name) : {})}
                        {...otherProps}
                        autoComplete={name}
                      >
                        {children}
                      </Tag>
                      {errors && errors[name] && (
                        <p className="text-xs text-red-600 mt-2">
                          {errors[name]["message"]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {type === "checkbox" || type === "radio" ? (
                        <div className={containerClass ?? ""}>
                          <input
                            type={type}
                            name={name}
                            id={name}
                            ref={(r) => {
                              if (refCallback) refCallback(r);
                            }}
                            className={`${className} ${
                              errors && errors[name]
                                ? "border-red-500 focus:border-red-500 text-red-700  pe-10"
                                : ""
                            }`}
                            {...(register ? register(name) : {})}
                            {...otherProps}
                          />
                          <label
                            className={labelClassName ?? ""}
                            htmlFor={name}
                          >
                            {label} {otherComp}
                          </label>
                        </div>
                      ) : (
                        <div className={`${containerClass ?? ""} relative`}>
                          {label && (
                            <label
                              className={labelClassName ?? ""}
                              htmlFor={name}
                            >
                              {label}
                            </label>
                          )}
                          <input
                            type={type}
                            placeholder={placeholder}
                            name={name}
                            id={name}
                            ref={(r) => {
                              if (refCallback) refCallback(r);
                            }}
                            className={`${className} ${
                              errors && errors[name]
                                ? "border-red-500 focus:border-red-500 text-red-700  pe-10"
                                : ""
                            }`}
                            {...(register ? register(name) : {})}
                            {...otherProps}
                            autoComplete={name}
                          />
                          {errors && errors[name] && (
                            <>
                              <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
                                <i className="mgc_warning_fill text-xl text-red-500" />
                              </div>
                              <p className="text-xs text-red-600 mt-2">
                                {errors[name]["message"]}
                              </p>
                            </>
                          )}
                          {children ? children : null}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default FormInput;
