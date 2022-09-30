import winston from "winston";

function filterOnly(level) {
  return winston.format(function (info) {
    if (info.level === level) {
      return info;
    }
  })();
}

export const Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.label({ label: "[LOGGER]" }),
    winston.format.timestamp({ format: "YY-MM-DD HH:MM:SS" }),
    winston.format.printf(
      (log) =>
        ` ${log.label}  ${log.timestamp}  ${log.level} : ${log.message} ${
          log.stack ?? ""
        }`
    )
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
      level: "info",
    }),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: filterOnly("error"),
      maxsize: 1000000,
      maxFiles: 20,
      tailable: true,
      zippedArchive: true,
    }),
    new winston.transports.File({
      filename: "./logs/warn.log",
      level: "warn",
      format: filterOnly("warn"),
      maxsize: 1000000,
      maxFiles: 20,
      tailable: true,
      zippedArchive: true,
    }),
    new winston.transports.File({
      filename: "./logs/info.log",
      level: "info",
      format: filterOnly("info"),
      maxsize: 1000000,
      maxFiles: 20,
      tailable: true,
      zippedArchive: true,
    }),
  ],
});
