# Build stage using Maven and JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies to cache this layer
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build package (skipping tests for packaging speed)
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage using a lightweight JRE 17
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy compiled jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
