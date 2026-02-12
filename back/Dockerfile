# ステージ1: ビルド
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# pom.xmlとソースコードをコピー
COPY pom.xml .
COPY src ./src
# パッケージング（テストはスキップ）
RUN mvn clean package -DskipTests

# ステージ2: 実行
FROM eclipse-temurin:21-jre
WORKDIR /app
# ビルドステージからjarファイルをコピー
COPY --from=build /app/target/*.jar app.jar
# ポート8080を開放
EXPOSE 8080
# アプリケーション実行
ENTRYPOINT ["java", "-jar", "app.jar"]