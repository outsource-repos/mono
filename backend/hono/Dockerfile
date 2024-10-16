FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# 设置 Bun 镜像
RUN bun pm set registry https://registry.npmmirror.com

# 安装依赖
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# 复制生产依赖和源代码到最终镜像
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY src src
COPY tsconfig.json .

# 运行应用
USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "src/index.ts"]