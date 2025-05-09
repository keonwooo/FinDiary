package com.kwfw.findiary.config;

import com.kwfw.findiary.common.ConstantCommon;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class AspectConfig {

    @Pointcut("execution(* com.kwfw.findiary.controller..*(..))")
    private void doExecute() {
    }

    @Around("doExecute()")
    public Object doLogging(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        try {
            log.info(ConstantCommon.ANSI_GREEN + "::: {} BEGIN :::" + ConstantCommon.ANSI_RESET, methodName);
//            LOGGER.info("{} PARAMS ::: {}", methodName, JsonHelper.objToJsonString(joinPoint.getArgs()));
            return joinPoint.proceed();
        } finally {
            log.info(ConstantCommon.ANSI_BLUE + "::: {} END ::: \n" + ConstantCommon.ANSI_RESET, methodName);
        }
    }
}
