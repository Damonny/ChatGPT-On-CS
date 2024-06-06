import React, { useEffect } from 'react';
import { Box, Button, Stack, useToast, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import GptSettings from './GptSettings';
import CustomerServiceSettings from './CustomerServiceSettings';
import { getConfig, updateConfig } from '../../services/platform/controller';
import { useSettings } from './SettingsContext';
import { trackPageView } from '../../services/analytics';

const SettingsPage = () => {
  useEffect(() => {
    // 页面访问埋点
    trackPageView('Settings');
  }, []);

  const {
    customerServiceSettings,
    setCustomerServiceSettings,
    gptSettings,
    setGptSettings,
  } = useSettings();
  const toast = useToast();
  const { data, isLoading } = useQuery(['config'], getConfig);

  useEffect(() => {
    if (data && !isLoading) {
      setGptSettings({
        useDify: data.data.use_dify || false,
        gptAddress: data.data.gpt_base_url || '',
        model: data.data.gpt_model || '',
        temperature: data.data.gpt_temperature || 0.7,
        apiKey: data.data.gpt_key || '',
        topP: data.data.gpt_top_p || 0.75,
        stream: data.data.stream || false,
      });
      setCustomerServiceSettings({
        extractPhone: data.data.extract_phone || false,
        extractProduct: data.data.extract_product || false,
        folderPath: data.data.save_path || '',
        replySpeed: data.data.reply_speed || [0, 0],
        contextCount: data.data.context_count || 1,
        manualInterventionInterval: data.data.wait_humans_time || 60,
        defaultReply: data.data.default_reply || '',
      });
    }
  }, [isLoading, data, setGptSettings, setCustomerServiceSettings]);

  const handleSaveSettings = async () => {
    try {
      await updateConfig({
        extract_phone: customerServiceSettings.extractPhone,
        extract_product: customerServiceSettings.extractProduct,
        save_path: customerServiceSettings.folderPath.trim(),
        reply_speed: customerServiceSettings.replySpeed,
        default_reply: customerServiceSettings.defaultReply.trim(),
        context_count: customerServiceSettings.contextCount,
        wait_humans_time: customerServiceSettings.manualInterventionInterval,
        gpt_base_url: gptSettings.gptAddress.trim(),
        gpt_key: gptSettings.apiKey.trim(),
        gpt_model: gptSettings.model.trim(),
        gpt_temperature: gptSettings.temperature,
        gpt_top_p: gptSettings.topP,
        stream: gptSettings.stream,
        use_dify: gptSettings.useDify,
      });
      toast({
        position: 'top',
        title: '保存成功',
        status: 'success',
      });
    } catch (error: any) {
      toast({
        position: 'top',
        title: '保存失败',
        description: error.message,
        status: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <Stack m={10}>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <CustomerServiceSettings />
        <GptSettings />
        <Button colorScheme="blue" onClick={handleSaveSettings}>
          保存设置
        </Button>
      </Stack>
    </Box>
  );
};

export default SettingsPage;
