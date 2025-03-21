// app/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
// date-fns の差分計算
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

// 登録データの型
type RegisteredDate = {
  id: string;       // 一意に識別するためのID
  title: string;    // 例: "結婚記念日"
  date: string;     // 例: "2023-03-01T12:00:00.000Z" など
};

type UnitType = "years" | "months" | "days" | "hours" | "minutes" | "seconds";

const unitLabels: Record<UnitType, string> = {
  years: "年",
  months: "月",
  days: "日",
  hours: "時",
  minutes: "分",
  seconds: "秒",
};

export default function IndexScreen() {
  const router = useRouter();
  const [registeredDates, setRegisteredDates] = useState<RegisteredDate[]>([]);
  // 表示単位（"seconds" | "minutes" | ...）
  const [unit, setUnit] = useState<UnitType>("years");

  // 起動時に AsyncStorage からデータを読み込む
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@registeredDates");
      if (jsonValue) {
        const parsed = JSON.parse(jsonValue) as RegisteredDate[];
        setRegisteredDates(parsed);
      }
    } catch (e) {
      console.log("Error loading data:", e);
    }
  };

  // 経過時間の計算
  const getDiff = (targetDateString: string) => {
    const now = new Date();
    const target = new Date(targetDateString);

    switch (unit) {
      case "seconds":
        return differenceInSeconds(now, target);
      case "minutes":
        return differenceInMinutes(now, target);
      case "hours":
        return differenceInHours(now, target);
      case "days":
        return differenceInDays(now, target);
      case "months":
        return differenceInMonths(now, target);
      case "years":
        return differenceInYears(now, target);
    }
  };

  // 表示単位を切り替える
  const toggleUnit = () => {
    // 簡易的に配列でループ
    const units: typeof unit[] = ["seconds", "minutes", "hours", "days", "months", "years"];
    const currentIndex = units.indexOf(unit);
    const nextIndex = (currentIndex + 1) % units.length;
    setUnit(units[nextIndex]);
  };

  // カードの描画
  const renderItem = ({ item }: { item: RegisteredDate }) => {
    return (
      <View className="border rounded p-4 m-2">
        <Text className="text-lg font-bold mb-2">{item.title}</Text>
        <Text>
          {`${getDiff(item.date)}${unitLabels[unit]} 経過`}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">登録日時一覧</Text>

      <FlatList
        data={registeredDates}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Pressable
        onPress={toggleUnit}
        className="bg-blue-500 rounded p-4 my-2"
      >
        <Text className="text-white text-center">表示切替 ({unitLabels[unit]})</Text>
      </Pressable>

      {/* 新規登録ボタン */}
      <Pressable
        onPress={() => router.push("/new")}
        className="bg-green-500 rounded p-4"
      >
        <Text className="text-white text-center">新規登録</Text>
      </Pressable>


    </View>
  );
}
