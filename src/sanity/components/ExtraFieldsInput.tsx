"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { set, unset, useClient } from "sanity";
import type { ArrayOfObjectsInputProps } from "sanity";
import { Box, Card, Flex, Label, Spinner, Stack, Text, TextInput } from "@sanity/ui";

interface ExtraFieldValue {
  _key: string;
  label: string;
  value: string;
}

const generateKey = () => Math.random().toString(36).slice(2, 8);

const ExtraFieldsInput = (props: ArrayOfObjectsInputProps) => {
  const { onChange, value } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<string[] | null>(
        `*[_type == "newFamilySettings"][0].extraFieldLabels`,
      )
      .then((result) => {
        setLabels(result ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [client]);

  const currentValues = useMemo(
    () => (value ?? []) as ExtraFieldValue[],
    [value],
  );

  const handleChange = useCallback(
    (label: string, newValue: string) => {
      const existing = [...currentValues];
      const idx = existing.findIndex((f) => f.label === label);

      if (newValue) {
        if (idx >= 0) {
          existing[idx] = { ...existing[idx], value: newValue };
        } else {
          existing.push({ _key: generateKey(), label, value: newValue });
        }
        onChange(set(existing));
      } else {
        if (idx >= 0) {
          existing.splice(idx, 1);
          if (existing.length > 0) {
            onChange(set(existing));
          } else {
            onChange(unset());
          }
        }
      }
    },
    [currentValues, onChange],
  );

  if (loading) {
    return (
      <Flex align="center" justify="center" padding={4}>
        <Spinner muted />
      </Flex>
    );
  }

  if (labels.length === 0) {
    return (
      <Card padding={3} tone="caution" border radius={2}>
        <Text size={1}>
          &ldquo;새가족 &gt; 새가족 설정&rdquo;에서 추가 정보 항목을 먼저
          정의하세요.
        </Text>
      </Card>
    );
  }

  return (
    <Stack space={3}>
      {labels.map((label) => {
        const field = currentValues.find((f) => f.label === label);
        return (
          <Card key={label} padding={3} border radius={2}>
            <Stack space={2}>
              <Label size={1}>{label}</Label>
              <TextInput
                value={field?.value ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(label, e.currentTarget.value)
                }
                placeholder={`${label}을(를) 입력하세요`}
              />
            </Stack>
          </Card>
        );
      })}

      {/* 설정에 없는 기존 항목이 있으면 표시 (레거시 데이터 보존) */}
      {currentValues
        .filter((f) => !labels.includes(f.label))
        .map((field) => (
          <Card key={field._key} padding={3} border radius={2} tone="caution">
            <Stack space={2}>
              <Flex align="center" gap={2}>
                <Label size={1}>{field.label}</Label>
                <Box>
                  <Text size={0} muted>
                    (설정에 없는 항목)
                  </Text>
                </Box>
              </Flex>
              <TextInput
                value={field.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(field.label, e.currentTarget.value)
                }
              />
            </Stack>
          </Card>
        ))}
    </Stack>
  );
};

export default ExtraFieldsInput;
