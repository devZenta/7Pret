#!/bin/bash
MSG=$(cat "$1")
# Regex: type(optional-scope): message
if ! echo "$MSG" | grep -qE '^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\([^)]+\))?: .+'; then
  echo ""
  echo "Invalid commit message format!"
  echo ""
  echo "Expected: <type>: <message>  or  <type>(scope): <message>"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert"
  echo ""
  echo "Examples:"
  echo "  feat: add login functionality"
  echo "  fix(api): resolve null pointer exception"
  echo ""
  echo "Your message: $MSG"
  exit 1
fi
