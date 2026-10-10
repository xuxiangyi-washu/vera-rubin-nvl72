import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePolicyDemo as evaluate } from '../src/utils/policy-demo.mjs';
test('教学策略仅在匹配的读请求上允许转发和凭证使用',()=>{assert.equal(evaluate({scenario:'read',mode:'enforce'}).credentialReleased,true)});
test('L7 audit记录写入而enforce阻断，不把审计表现为阻断',()=>{assert.equal(evaluate({scenario:'write',mode:'audit'}).result,'audit-only');assert.equal(evaluate({scenario:'write',mode:'enforce'}).forwarded,false)});
test('audit不绕过网络授权和凭证目标绑定',()=>{for(const scenario of ['network','credential']){const result=evaluate({scenario,mode:'audit'});assert.equal(result.forwarded,false);assert.equal(result.credentialReleased,false)}});
test('未知模式不会产生假定放行的教学结果',()=>{assert.throws(()=>evaluate({scenario:'read',mode:'unknown'}));assert.throws(()=>evaluate({scenario:'unknown',mode:'audit'}))});
