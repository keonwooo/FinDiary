package com.kwfw.findiary.config;

import com.kwfw.findiary.common.JsonHelper;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AspectConfig {

    Logger LOGGER = LoggerFactory.getLogger(AspectConfig.class);

    @Pointcut("execution(* com.kwfw.findiary.controller..*(..))")
    private void doExecute() {}

    @Around("doExecute()")
    public Object doLogging(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        try {
            LOGGER.info("::: {} BEGIN :::", methodName);
//            LOGGER.info("{} PARAMS ::: {}", methodName, JsonHelper.objToJsonString(joinPoint.getArgs()));
            return joinPoint.proceed();
        } finally {
            LOGGER.info("::: {} END :::", methodName);
        }
    }
}
