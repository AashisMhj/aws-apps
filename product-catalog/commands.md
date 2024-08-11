# Commands

```bash
# building docker image with both frontend and server
docker built -t product-catalog:latest .
# start container 
docker run -p 81:80 -p 5000:5000 product-catalog:latest
```