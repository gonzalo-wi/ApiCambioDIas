FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY my-go-project ./my-go-project
WORKDIR /app/my-go-project
RUN go mod download
RUN go build -o /app/app ./cmd

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/app .
EXPOSE 8080
CMD ["./app"]