# Python Server
FROM python:3.12-slim AS python-server

WORKDIR /app
COPY server/python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/python/ .

EXPOSE 8765
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8765", "--ws-ping-interval", "20", "--ws-ping-timeout", "20"]

#---

# Go Server
FROM golang:1.22-alpine AS go-builder

WORKDIR /app
COPY server/go/go.mod server/go/go.sum ./
RUN go mod download
COPY server/go/ .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o sendit-server .

FROM alpine:3.19 AS go-server
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=go-builder /app/sendit-server .
EXPOSE 8766
CMD ["./sendit-server"]
