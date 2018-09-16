FROM kinlan/puppets:latest

WORKDIR app

COPY . /app/

ENV NODE_ENV production

RUN npm install --production

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules \
    # deal png
    && chown -R pptruser:pptruser .

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 8084

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "-r", "dotenv/config", "."]